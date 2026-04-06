import React, { useEffect, useRef, useState } from 'react'
import { socket } from "../socket"
import { useLocation, useParams } from "react-router-dom";

export default function JoinedRoom() {

  const { id } = useParams()
  const location = useLocation()
  const { username, userId } = location.state || {};

  const [users, setUsers] = useState([]);

  const peerRef = useRef(null);
  const remoteSocketRef = useRef(null);
  const isCallerRef = useRef(false); // ✅ NEW

  // ✅ CONNECT
  useEffect(() => {
    const handleConnect = () => {
      console.log(`Connected: ${username} (${userId})`);
    };

    socket.on("connect", handleConnect);
    return () => socket.off("connect", handleConnect);
  }, [username, userId]);

  // ✅ JOIN ROOM
  useEffect(() => {
    if (!username || !userId || !id) return;

    socket.emit("join-room", {
      roomId: id,
      userId,
      name: username,
    });

    socket.on("user-joined", (data) => {
      console.log("New User joined", data);

      setUsers((prev) => {
        if (prev.find(u => u.socketId === data.socketId)) return prev;
        return [...prev, data];
      });

      // ✅ ONLY NEW USER WILL CALL
      isCallerRef.current = true;
    });

    return () => socket.off("user-joined");
  }, [username, userId, id]);

  // ✅ EXISTING USERS
  useEffect(() => {
    socket.on("all-users", (usersList) => {
      console.log("Existing users:", usersList);
      setUsers(usersList);
    });

    return () => socket.off("all-users");
  }, []);

  // ✅ USER LEFT
  useEffect(() => {
    socket.on("user-left", (socketId) => {
      console.log("User left:", socketId);

      setUsers((prev) =>
        prev.filter((user) => user.socketId !== socketId)
      );
    });

    return () => socket.off("user-left");
  }, []);

  // ✅ CREATE PEER
  useEffect(() => {
    peerRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });

    // 🔥 SEND ICE
    peerRef.current.onicecandidate = (event) => {
      if (event.candidate && remoteSocketRef.current) {
        socket.emit("send-candidate", {
          to: remoteSocketRef.current,
          candidate: event.candidate,
        });
      }
    };

    // 🔥 DEBUG
    peerRef.current.onconnectionstatechange = () => {
      console.log("Connection state:", peerRef.current.connectionState);
    };

    return () => {
      peerRef.current?.close();
    };
  }, []);

  // ✅ SEND OFFER (ONLY CALLER)
  useEffect(() => {
    if (!peerRef.current) return;
    if (users.length === 0) return;
    if (!isCallerRef.current) return; // 🛑 KEY FIX

    const user = users[0];
    if (!user) return;

    const createOffer = async () => {
      console.log("Calling:", user.socketId);

      remoteSocketRef.current = user.socketId;

      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      socket.emit("send-offer", {
        to: user.socketId,
        offer,
      });
    };

    createOffer();

  }, [users]);

  // ✅ RECEIVE OFFER → SEND ANSWER
  useEffect(() => {
    socket.on("receive-offer", async ({ offer, from }) => {
      console.log("Received offer from:", from);

      const peer = peerRef.current;
      remoteSocketRef.current = from;

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("send-answer", {
        to: from,
        answer,
      });
    });

    return () => socket.off("receive-offer");
  }, []);

  // ✅ RECEIVE ANSWER
  useEffect(() => {
    socket.on("receive-answer", async ({ answer, from }) => {
      const peer = peerRef.current;

      if (peer.signalingState !== "have-local-offer") {
        console.warn("Skipping answer, wrong state:", peer.signalingState);
        return;
      }

      console.log("Received answer from:", from);

      await peer.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    return () => socket.off("receive-answer");
  }, []);

  // ✅ RECEIVE ICE
  useEffect(() => {
    socket.on("receive-candidate", async ({ candidate }) => {
      try {
        await peerRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
        console.log("ICE added");
      } catch (err) {
        console.error("ICE error:", err);
      }
    });

    return () => socket.off("receive-candidate");
  }, []);
  

  return (
    <div>JoinedRoom</div>
  );
}