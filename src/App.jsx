import { UserProvider } from "./Components/UserContext";
import Authentication from "./Components/Authentication";
import "./App.css";
function App() {
  return (
    <UserProvider>
      <Authentication></Authentication>
    </UserProvider>
  );
}

export default App;
