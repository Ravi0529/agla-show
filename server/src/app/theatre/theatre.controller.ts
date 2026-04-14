import type { Request, Response } from "express";
import TheatreService from "./theatre.service";
import { createTheatreSchema } from "./theatre.schema";

class TheatreController {
  private theatreService = new TheatreService();

  public async createTheatre(req: Request, res: Response) {
    try {
      const parsed = createTheatreSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
      }

      const theatre = await this.theatreService.createTheatre(parsed.data);

      return res.status(201).json({
        message: "Theatre created successfully",
        theatre,
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create theatre" });
    }
  }

  public async getAllTheatres(_: Request, res: Response) {
    try {
      const theatres = await this.theatreService.getAllTheatres();

      return res.status(200).json({ theatres });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch theatres" });
    }
  }

  public async getTheatreById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Invalid theatre ID" });
      }

      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid theatre ID" });
      }
      const theatre = await this.theatreService.getTheatreById(id);

      if (!theatre) {
        return res.status(404).json({ error: "Theatre not found" });
      }

      return res.status(200).json({ theatre });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch theatre" });
    }
  }
}

export default TheatreController;
