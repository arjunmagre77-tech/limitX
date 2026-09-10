import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Home from "@/pages/Home";
import Feed from "@/pages/Feed";
import Explore from "@/pages/Explore";
import Profile from "@/pages/Profile";
import PostDetail from "@/pages/PostDetail";
import TeamProfile from "@/pages/TeamProfile";
import TeamsList from "@/pages/TeamsList";
import PlayerProfile from "@/pages/PlayerProfile";
import PlayersList from "@/pages/PlayersList";
import HashtagPage from "@/pages/HashtagPage";
import Notifications from "@/pages/Notifications";
import Bookmarks from "@/pages/Bookmarks";
import Messages from "@/pages/Messages";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import Tournaments from "@/pages/Tournaments";
import News from "@/pages/News";
import Store from "@/pages/Store";
import About from "@/pages/About";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/feed" component={Feed} />
      <Route path="/explore" component={Explore} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/teams" component={TeamsList} />
      <Route path="/team/:slug" component={TeamProfile} />
      <Route path="/players" component={PlayersList} />
      <Route path="/player/:username" component={PlayerProfile} />
      <Route path="/profile/:username" component={Profile} />
      <Route path="/post/:id" component={PostDetail} />
      <Route path="/hashtag/:tag" component={HashtagPage} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/messages" component={Messages} />
      <Route path="/news" component={News} />
      <Route path="/store" component={Store} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

