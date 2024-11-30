import Routes from "./src/routes";
import RoutesAuth from "./src/routesAuth";

const isUserAuth = false;

function App() {
  return isUserAuth ? <RoutesAuth /> : <Routes />;
}

export default App;
