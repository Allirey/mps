import React, {useEffect, useState, Suspense, lazy} from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import withStore from '../hocs/withStore';
import Header from '../components/header';
import PrivateRoute from "../components/PrivateRoute";
import SnackBar from "../components/snackbar";
import {Helmet} from "react-helmet";

const Articles = lazy(() => import("../pages/Blog/Articles"));
const ArticleDetail = lazy(() => import("../pages/Blog/ArticleDetail"));
const Register = lazy(() => import("../pages/Auth/Register"));
const Login = lazy(() => import("../pages/Auth/Login"));
const About = lazy(() => import("../pages/About"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const EditProfile = lazy(() => import("../pages/EditProfile"));
const ChangePassword = lazy(() => import("../pages/Auth/ChangePassword"));
const AccountActivation = lazy(() => import("../pages/Auth/AccountActivation"));
const PasswordResetRequest = lazy(() => import("../pages/Auth/PasswordResetRequest"));
const PasswordResetChange = lazy(() => import("../pages/Auth/PasswordResetChange"));
const ChessAnalysis = lazy(() => import("../pages/chess/ChessAnalysis"));
const Openings = lazy(() => import("../pages/chess/Openings"));
const CreateOpening = lazy(() => import("../pages/chess/CreateOpening"));
const Error404 = lazy(() => import("../errors/error404"));
const HomePage = lazy(() => import("../pages/HomePage"));

function App(props) {
   const [appLoading, setAppLoading] = useState(true)
   const {notifications} = props.stores

   useEffect(() => {
      props.stores.authStore.refresh().then(() => setAppLoading(false)).catch((e) => {
      })
   }, [])

   return (
     <Router>
        <Helmet
          title={'Technologies and chess'}
          titleTemplate="%s / Glitcher"
        >
           <meta name={"description"}
                 content={"Personal website of web developer. Content related to chess and programming, or another hobbies of mine."}/>
           <meta property={"og:title"} content={"Technologies and chess"}/>
           <meta property={"og:description"}
                 content={"Personal website of web developer. Content related to chess and programming, or another hobbies of mine."}/>
           <meta property={"og:type"} content={"website"}/>
           <meta name="twitter:card" content="summary"/>
           <meta name="twitter:title" content="Technologies and chess"/>
           <meta name="twitter:description"
                 content="Personal website of web developer. Content related to chess and programming, or another hobbies of mine."/>
           <meta name="twitter:site:id" content="741164490"/>
        </Helmet>

        <Header isLoading={appLoading}/>
        <SnackBar
          open={notifications.isOpen}
          text={notifications.text}
          onClose={notifications.handleClose}
          severity={notifications.severity}
        />
        <div>
           <Suspense fallback={<div/>}>
              <Switch>
                 <Route path="/" exact={true} component={HomePage}/>
                 <Route path="/chess/openings" exact={true} component={Openings}/>
                 <Route path="/chess/openings/new" exact={true} component={CreateOpening}/>
                 <Route path="/chess/openings/:slug" exact={true} component={ChessAnalysis}/>
                 <Route path="/chess/openings/:slug/:chapter_id" exact={true} component={ChessAnalysis}/>
                 <Route path="/chess/analysis" exact={true} component={ChessAnalysis}/>
                 <Route path="/chess/:db/:game_id" exact={true} component={ChessAnalysis}/>
                 <Route path="/login" exact={true} component={Login}/>
                 <Route path="/signup" exact={true} component={Register}/>
                 <Route path="/blog" exact={true} component={Articles}/>
                 <Route path="/blog/page/:currentPage" exact={true} component={Articles}/>
                 <Route path="/blog/new" exact={true} component={ArticleDetail}/>
                 <Route path="/blog/:slug" exact={true} component={ArticleDetail}/>
                 <Route path="/accounts/confirm-email/:id/:token" exact={true} component={AccountActivation}/>
                 <PrivateRoute path="/accounts/password/change" exact={true} component={ChangePassword}/>
                 <Route path="/accounts/password/reset" exact={true} component={PasswordResetRequest}/>
                 <Route path="/accounts/password/reset/:id/:token" exact={true} component={PasswordResetChange}/>
                 <Route path="/about" exact={true} component={About}/>
                 <PrivateRoute path="/settings" exact={true} component={EditProfile}/>
                 <Route path="/users" exact={true} component={HomePage}/>
                 <Route path="/users/:username" exact={true} component={UserProfile}/>
                 <Route path="**" exact={true} component={Error404}/>
              </Switch>
           </Suspense>
        </div>
     </Router>
   )
}

export default withStore(App);