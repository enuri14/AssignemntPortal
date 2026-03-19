import * as React from "react";
import {
  HashRouter,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

import AssignmentsPage from "./components/AssignmentsPage";
import AssignmentDetailsPage from "./components/AssignmentDetailsPage";

const RouterAny = HashRouter as any;
const SwitchAny = Switch as any;
const RouteAny = Route as any;
const NavLinkAny = NavLink as any;

const App: React.FC = () => {
  return (
    <RouterAny>
      <div className="app-root">
        <header className="top-bar">
          <span className="brand-name">
            Assignment<span>List</span>
          </span>

          <nav className="nav-links">
            <NavLinkAny
              exact
              to="/"
              className="nav-link"
              activeClassName="active"
            >
              Assignments
            </NavLinkAny>
          </nav>

          <button className="control-btn">Control Panel</button>
        </header>

        <main className="page-container">
          <SwitchAny>
            <RouteAny exact path="/" component={AssignmentsPage} />
            <RouteAny
              path="/assignments/:id"
              component={AssignmentDetailsPage}
            />
          </SwitchAny>
        </main>
      </div>
    </RouterAny>
  );
};

export default App;

