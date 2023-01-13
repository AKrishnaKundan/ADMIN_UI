import { Route, Switch } from "react-router-dom";
import Table from "./components/Landing";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/">
          <Table/>
        </Route>
      </Switch>
    </div>
  );
  
}

export default App;