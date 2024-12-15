import { UserProvider } from "./Components/UserContext";
import Authentication from "./Components/Authentication";
function App() {
  return (
    <UserProvider>
      <Authentication></Authentication>
    </UserProvider>
  );
}

export default App;
