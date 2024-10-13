/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [gcServers, setGcServers] = useState<any[]>([]);
  const [fireGameServers, setFireGameServers] = useState<any[]>([]);
  const [types, setTypes] = useState([]);

  const [filter, setFilter] = useState("Deathmatch");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
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

    fetch("https://api.firegamesnetwork.com/servers?gamemode=retakes")
      .then((res) => res.json())
      .then((data) => setFireGameServers(data));
  }, [refresh]);

  function handleCopyServer(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  console.log(gcServers);
  console.log({ fireGameServers });

  return (
    <div className="w-full gap-2 flex flex-col items-center justify-items-center min-h-screen p-8 pb-20  font-[family-name:var(--font-geist-sans)]">
      <button
        className="bg-gray-800 text-white px-2 py-1 rounded-md ml-4"
        onClick={() => setRefresh(!refresh)}
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

      {filter === "Retake" && (
        <div className="w-full gap-2 flex flex-col items-center justify-items-center">
          <h2>FIRE GAME SERVERS</h2>
          {fireGameServers?.map((server, i) => (
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
                    Copy
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
        ?.sort((a, b) => a.mode_name.localeCompare(b.mode_name))
        ?.filter((server) => server.mode_name === filter)
        ?.map((server) => (
          <div key={server.id} className="w-full p-4 bg-gray-900 rounded-md">
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
                  Copy
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

      <hr />
    </div>
  );
}
