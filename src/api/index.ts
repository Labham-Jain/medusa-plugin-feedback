import { Router } from "express"
import ProductFeedback from "./routes/store/products/[id]/feedback";
import {
  getConfigFile,
} from "medusa-core-utils";
import { ConfigModule } from "@medusajs/medusa";
import cors from 'cors'

export default (rootDirectory) => {
  const { configModule: { projectConfig } } = getConfigFile<ConfigModule>(rootDirectory, "medusa-config")

  const storefrontCorsConfig = {
    origin: [...(projectConfig.admin_cors || "")?.split(','), ...(projectConfig.store_cors || "").split(',')],
    credentials: true,
  }

  const router = Router();

  router.use(cors(storefrontCorsConfig))

  const endpointHandlers = [ProductFeedback]


  endpointHandlers.forEach(endpointHandle => endpointHandle({ router }))

  return router
}