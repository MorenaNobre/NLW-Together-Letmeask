import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { Button } from "../components/Button";
import {
  Auth,
  Introduction,
  ImgBg,
  Title,
  SubTitle,
  Main,
  MainContent,
  ImgLogo,
  ButtonCreate,
  ImgGoogleIcon,
  Separator,
  FormInput,
  Input,
} from "../styles/HomePage";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does not exists.");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Room already closed.");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <>
      <Auth>
        <Introduction>
          <ImgBg src={illustrationImg} />
          <Title>Crie salas de Q&amp;A ao-vivo</Title>
          <SubTitle>Tire as dúvidas de sua audiência em tempo-real</SubTitle>
        </Introduction>
        <Main>
          <MainContent>
            <ImgLogo src={logoImg} />
            <ButtonCreate onClick={handleCreateRoom}>
              <ImgGoogleIcon src={googleIconImg} alt="Logo do Google" />
              Crie sua sala com o Google
            </ButtonCreate>
            <Separator>ou entre em uma sala</Separator>
            <FormInput onSubmit={handleJoinRoom}>
              <Input
                type="text"
                placeholder="Digite o código da sala"
                onChange={(event) => setRoomCode(event.target.value)}
                value={roomCode}
              />
              <Button type="submit">Entrar na sala</Button>
            </FormInput>
          </MainContent>
        </Main>
      </Auth>
    </>
  );
}
