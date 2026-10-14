import { LoginForm } from "./LoginForm"

export const metadata = { title: "Command center · VULT LABEL" }

export default function Login() {
  return (
    <main className="login">
      <p className="wordmark">VULT LABEL</p>
      <h1 className="login__title">Command center</h1>
      <LoginForm />
    </main>
  )
}
