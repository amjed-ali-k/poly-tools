import { ImageResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1178,
          height: 768,
          display: "flex",
          textAlign: "center",
          fontFamily: "Montserrat",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: 1178,
            height: 768,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            width={1178}
            height={768}
          >
            <path
              d="M-23 791V-23h1224v814z"
              style={{
                fill: "#e7ded9",
              }}
            />
            <path
              d="M952 75c0 3-2 5-5 5-2 0-5-2-5-5 0-2 3-4 5-4 3 0 5 2 5 4zm-43 0a5 5 0 0 1-10 0c0-2 3-4 5-4 3 0 5 2 5 4zm86 0c0 3-2 5-5 5s-5-2-5-5c0-2 2-4 5-4s5 2 5 4zm43 0a5 5 0 0 1-10 0c0-2 2-4 5-4s5 2 5 4zm43 0c0 3-3 5-5 5-3 0-5-2-5-5 0-2 2-4 5-4 2 0 5 2 5 4zm43 0c0 3-3 5-5 5-3 0-5-2-5-5 0-2 2-4 5-4 2 0 5 2 5 4zm-172 43c0 3-2 5-5 5a5 5 0 0 1 0-10c3 0 5 3 5 5zm-43 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0zm86 0c0 3-2 5-5 5s-5-2-5-5c0-2 2-5 5-5s5 3 5 5zm43 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0zm43 0c0 3-3 5-5 5a5 5 0 0 1 0-10c2 0 5 3 5 5zm43 0c0 3-3 5-5 5a5 5 0 0 1 0-10c2 0 5 3 5 5zm-172 43c0 3-2 5-5 5-2 0-5-2-5-5s3-5 5-5c3 0 5 2 5 5zm-43 0c0 3-2 5-5 5-2 0-5-2-5-5a5 5 0 0 1 10 0zm86 0c0 3-2 5-5 5s-5-2-5-5 2-5 5-5 5 2 5 5zm43 0c0 3-2 5-5 5s-5-2-5-5a5 5 0 0 1 10 0zm43 0c0 3-3 5-5 5-3 0-5-2-5-5s2-5 5-5c2 0 5 2 5 5zm43 0c0 3-3 5-5 5-3 0-5-2-5-5s2-5 5-5c2 0 5 2 5 5zm-172 43c0 3-2 5-5 5-2 0-5-2-5-5s3-5 5-5c3 0 5 2 5 5zm-43 0a5 5 0 0 1-10 0c0-3 3-5 5-5 3 0 5 2 5 5zm86 0c0 3-2 5-5 5s-5-2-5-5 2-5 5-5 5 2 5 5zm43 0a5 5 0 0 1-10 0c0-3 2-5 5-5s5 2 5 5zm43 0c0 3-3 5-5 5-3 0-5-2-5-5s2-5 5-5c2 0 5 2 5 5zm43 0c0 3-3 5-5 5-3 0-5-2-5-5s2-5 5-5c2 0 5 2 5 5zm-172 43c0 3-2 5-5 5a5 5 0 0 1 0-10c3 0 5 2 5 5zm-43 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0zm86 0c0 3-2 5-5 5s-5-2-5-5 2-5 5-5 5 2 5 5zm43 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0zm43 0c0 3-3 5-5 5a5 5 0 0 1 0-10c2 0 5 2 5 5zm43 0c0 3-3 5-5 5a5 5 0 0 1 0-10c2 0 5 2 5 5zm-172 43c0 3-2 5-5 5-2 0-5-2-5-5s3-5 5-5c3 0 5 2 5 5zm-43 0c0 3-2 5-5 5-2 0-5-2-5-5a5 5 0 0 1 10 0zm86 0c0 3-2 5-5 5s-5-2-5-5 2-5 5-5 5 2 5 5zm43 0c0 3-2 5-5 5s-5-2-5-5a5 5 0 0 1 10 0zm43 0c0 3-3 5-5 5-3 0-5-2-5-5s2-5 5-5c2 0 5 2 5 5zm43 0c0 3-3 5-5 5-3 0-5-2-5-5s2-5 5-5c2 0 5 2 5 5zm-172 43c0 2-2 5-5 5-2 0-5-3-5-5 0-3 3-5 5-5 3 0 5 2 5 5zm-43 0a5 5 0 0 1-10 0c0-3 3-5 5-5 3 0 5 2 5 5zm86 0c0 2-2 5-5 5s-5-3-5-5c0-3 2-5 5-5s5 2 5 5zm43 0a5 5 0 0 1-10 0c0-3 2-5 5-5s5 2 5 5zm43 0c0 2-3 5-5 5-3 0-5-3-5-5 0-3 2-5 5-5 2 0 5 2 5 5zm43 0c0 2-3 5-5 5-3 0-5-3-5-5 0-3 2-5 5-5 2 0 5 2 5 5z"
              style={{
                fill: "#fefefe",
              }}
            />
            <path
              d="M1201 791H-23V445h1224z"
              style={{
                fill: "#9ed8df",
              }}
            />
            <path
              d="M473 503H68m405-101H68m469 101h283M596 713h224M68 73h752M651 468l-13 30m109-30-13 30"
              style={{
                fill: "none",
                stroke: "#3b3a3f",
                strokeMiterlimit: 10,
              }}
            />
          </svg>
          <div
            style={{
              position: "relative",
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                fontSize: 25,
                fontWeight: 400,
                top: 75,
                left: 75,
              }}
            >
              IIC | IEDC | GPTC Perinthalmanna
            </div>
            <div
              style={{
                fontSize: 60,
                position: "absolute",
                fontWeight: 600,
                top: 120,
                left: 70,
              }}
            >
              CERTIFICATE
            </div>
            <div
              style={{
                fontSize: 60,
                position: "absolute",
                fontWeight: 600,
                fontFamily: "Montserrat",
                top: 190,
                left: 70,
              }}
            >
              OF PARTICIPATION
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 25,
                fontWeight: 400,
                top: 270,
                left: 70,
              }}
            >
              THIS CERTIFICATE IS PRESENTED TO
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 45,
                fontWeight: 200,
                top: 330,
                left: 80,
              }}
            >
              Amjed Ali K
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 18,
                fontWeight: 600,
                top: 465,
                left: 70,
              }}
            >
              2 Days Workshop on Design Thinking
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 18,
                fontWeight: 600,
                top: 465,
                left: 580,
              }}
            >
              12
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 18,
                fontWeight: 600,
                top: 465,
                left: 660,
              }}
            >
              Sept
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 18,
                fontWeight: 600,
                top: 465,
                left: 745,
              }}
            >
              2023
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 17,
                fontWeight: 400,
                top: 525,
                left: 70,
                maxWidth: 1000,
                textAlign: "left",
              }}
            >
              This is to certify that, to the best of my knowledge, the
              participant named above attended and actively participated in the
              2 Days Workshop on Design Thinking organized by IEDC, GPC
              Perinthalmanna on 1 and 2 November 2023 at GPC Perinthalmanna. The
              participant has shown a commitment to learning and has
              successfully completed the requirements of this workshop.
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 18,
                fontWeight: 600,
                top: 665,
                left: 595,
              }}
            >
              Sanjay V
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 15,
                fontWeight: 400,
                top: 695,
                left: 595,
              }}
            >
              Lecturer In Electrical Engineering, GPTC Perinthalmanna
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1178,
      height: 768,
      fonts: [
        {
          name: "Montserrat",
          data: await fetch(
            new URL("../../../assets/Montserrat-Bold.ttf", import.meta.url)
          ).then((res) => res.arrayBuffer()),
          style: "normal",
          weight: 600,
        },
        {
          name: "Montserrat",
          data: await fetch(
            new URL("../../../assets/Montserrat-Medium.ttf", import.meta.url)
          ).then((res) => res.arrayBuffer()),
          style: "normal",
          weight: 400,
        },
        {
          name: "Montserrat",
          data: await fetch(
            new URL("../../../assets/Montserrat-Light.ttf", import.meta.url)
          ).then((res) => res.arrayBuffer()),
          style: "normal",
          weight: 200,
        },
      ],
    }
  );
}
