import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Landing from "../pages/Landing";
import AgeGate from "../pages/AgeGate";
import Plans from "../pages/Plans";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/age-gate" element={<AgeGate />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
