import { requestPageScan } from "../../controllers/scan/scan.controller";
import { Router } from "express";

export const setRoutes = (router: Router) => {
    router.post('/api/request-page', requestPageScan);
};
