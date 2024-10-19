/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [gcServers, setGcServers] = useState<any[]>([]);
  const [fireGameServers, setFireGameServers] = useState<any[]>([]);
  const [types, setTypes] = useState([]);

  const [filter, setFilter] = useState("Retake");
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmCopy, setConfirmCopy] = useState("");

  useEffect(() => {
    try {
      fetch("https://gamersclub.com.br/api/servers?server-type=CS2&items=30", {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          setGcServers(data.servers);

          const serversTypes = data.servers.reduce(
            (acc: any[], server: { mode_name: any }) => {
              if (!acc.includes(server.mode_name)) {
                acc.push(server.mode_name);
              }
              return acc;
            },
            []
          );

          setTypes(serversTypes);
        });

      fetch("/api/server")
        .then((res) => res?.json())
        .then(({ data }) => setFireGameServers(data));
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmCopy("");
      setIsLoading(false);
    }
  }, [refresh]);

  function handleCopyServer(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setConfirmCopy(text);
  }

  return (
    <div className="w-full gap-2 flex flex-col items-center justify-items-center min-h-screen p-8 pb-20  font-[family-name:var(--font-geist-sans)]">
      <button
        className="bg-gray-800 text-white px-2 py-1 rounded-md ml-4"
        onClick={() => {
          setIsLoading(true);
          setRefresh(!refresh);
        }}
      >
        refresh
      </button>
      <div className="w-full gap-2">
        {types.map((server) => (
          <button
            key={server}
            className="bg-gray-800 text-white px-2 py-1 rounded-md ml-4"
            onClick={() => setFilter(server)}
          >
            {server}
          </button>
        ))}
      </div>

      {isLoading ? (
        <svg
          className="animate-spin h-7 w-5 "
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 1024 1024"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z"></path>
        </svg>
      ) : (
        <>
          {filter === "Retake" && (
            <div className="w-full gap-2 flex flex-col items-center justify-items-center">
              <h2>FIRE GAME SERVERS</h2>
              {fireGameServers
                ?.sort((a, b) => +a.maxPlayers - +b.maxPlayers)
                ?.map((server, i) => (
                  <div key={i} className="w-full p-4 bg-gray-900 rounded-md">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold">{server.name}</h3>
                      <p>
                        {server.connect}
                        <button
                          className="bg-gray-800 text-white px-2 py-1 rounded-md ml-4"
                          onClick={() =>
                            handleCopyServer(`connect ${server.connect}`)
                          }
                        >
                          {confirmCopy === `connect ${server.connect}` ? (
                            <div className=" flex">
                              <svg
                                className="w-5 h-4 fill-white"
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                              >
                                <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"></path>
                              </svg>
                            </div>
                          ) : (
                            "Copy"
                          )}
                        </button>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>
                        players: {server.maxPlayers} / {server.playersLength}
                      </p>
                      <p>map: {server.map}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <h2>GC SERVERS</h2>
          {gcServers
            ?.sort((a, b) => +a.slots_used - +b.slots_used)
            ?.filter((server) => server.mode_name === filter)
            ?.map((server) => (
              <div
                key={server.id}
                className={`w-full p-4 bg-gray-900 rounded-md`}
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{server.name}</h3>
                  <p>
                    {server.ip}: {server.port}
                    <button
                      className="bg-gray-800 text-white px-2 py-1 rounded-md ml-4"
                      onClick={() =>
                        handleCopyServer(`connect ${server.ip}:${server.port}`)
                      }
                    >
                      {confirmCopy === `connect ${server.ip}:${server.port}` ? (
                        <div className=" flex">
                          <svg
                            className="w-5 h-4 fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                          >
                            <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"></path>
                          </svg>
                        </div>
                      ) : (
                        "Copy"
                      )}
                    </button>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p>
                    players: {server.slots_used} / {server.slots}
                  </p>
                  <p>map: {server.map_name}</p>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
}
