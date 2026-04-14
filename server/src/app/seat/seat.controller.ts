import type { Request, Response } from "express";
import SeatService from "./seat.service";

class SeatController {
  private seatService = new SeatService();

  public async getSeatsByShow(req: Request, res: Response) {
    try {
      const { showId } = req.params;

      if (!showId || Array.isArray(showId)) {
        return res.status(400).json({ error: "Show ID is required" });
      }

      const seats = await this.seatService.getSeatsByShow(showId);

      return res.status(200).json({ data: seats });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch seats" });
    }
  }
}

export default SeatController;
