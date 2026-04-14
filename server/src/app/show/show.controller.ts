import type { Request, Response } from "express";
import ShowService from "./show.service";
import { createShowSchema } from "./show.schema";

class ShowController {
  private showService = new ShowService();

  public async createShow(req: Request, res: Response) {
    try {
      const parsed = createShowSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
      }

      const show = await this.showService.createShow(parsed.data);

      return res.status(201).json({
        message: "Show created successfully",
        data: show,
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create show" });
    }
  }
}

export default ShowController;
