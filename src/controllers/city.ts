
import { Request, Response, Router, } from "express";

import { query, validationResult } from "express-validator";

import { getCityByName, getCityHistoryByName } from "../models/city";

// Init shared
const router = Router();


router.get("",
  [
    query("city").isIn(["Bergamo", "Milano", "Roma"])
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const response = await getCityByName(req.query.city);

      return res.status(200).json(response);
    } catch (err) {
      console.error(err.message, err);
      return res.status(500).json({
        error: err.message,
      });
    }
  });

router.get("/overview", async (req: Request, res: Response) => {
  try {
    const promises = [
      getCityByName("Bergamo"),
      getCityByName("Milano"),
      getCityByName("Roma"),
    ];

    const results = await Promise.all(promises);

    let tempSum = 0;
    const highestHumidity = {
      value: 0,
      city: "",
    };
    const highestTemp = {
      value: 0,
      city: "",
    };

    results.forEach((result) => {
      tempSum += result.main.temp;
      if (result.main.humidity > highestHumidity.value) {
        highestHumidity.city = result.name;
        highestHumidity.value = result.main.humidity;
      }

      if (result.main.temp > highestTemp.value) {
        highestTemp.city = result.name;
        highestTemp.value = result.main.temp;
      }
    });

    const response = {
      avgTemp: tempSum / results.length,
      highestHumidity,
      highestTemp,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err.message, err);
    return res.status(500).json({
      error: err.message,
    });
  }
});

router.get("/history",
  [
    query("city").isIn(["Bergamo", "Milano", "Roma"])
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const response = await getCityHistoryByName(req.query.city);

      const result = response.list.reduce((acc: any, element: any) => {
        acc.temp.push(element.main.temp);
        acc.pressure.push(element.main.pressure);
        acc.humidity.push(element.main.humidity);
        return acc;
      }, { temp: [], pressure: [], humidity: [] });

      return res.status(200).json(result);
    } catch (err) {
      console.error(err.message, err);
      return res.status(500).json({
        error: err.message,
      });
    }
  });

export default router;
