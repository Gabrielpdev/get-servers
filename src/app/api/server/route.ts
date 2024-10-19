// import { GoogleAuth } from "google-auth-library";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.firegamesnetwork.com/servers?gamemode=retakes"
    );

    const resData = await res.json();

    return Response.json({
      data: resData,
    });
  } catch (error) {
    console.error(error);
    return;
  }
}
