import axios from "axios";

export default function handler(req, res) {
  res.status(200).json({
    message: "✅ 디버깅용 응답!",
    SERVICE_KEY: process.env.SERVICE_KEY || "없음",
    areaCode: req.query.areaCode || "없음",
  });
}