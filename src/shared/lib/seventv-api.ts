export interface SevenTvEmote {
  id: string;
  name: string;
  animated: boolean;
  flags: number;
}

interface SevenTvEmoteRaw {
  id: string;
  name: string;
  data: {
    id: string;
    name: string;
    animated: boolean;
    flags: number;
    host: {
      url: string;
      files: Array<{
        name: string;
        static_name: string;
        width: number;
        frame_count: number;
      }>;
    };
  };
}

interface SevenTvGlobalResponse {
  emotes: SevenTvEmoteRaw[];
}

interface GqlSearchResponse {
  data: {
    emotes: {
      search: {
        items: Array<{
          id: string;
          default_name: string;
          animated: boolean;
          images: Array<{
            url: string;
            mime: string;
            scale: number;
            width: number;
            height: number;
            frame_count: number;
          }>;
        }>;
        total_count: number;
      };
    };
  };
}

function mapRawEmote(raw: SevenTvEmoteRaw): SevenTvEmote {
  return {
    id: raw.data.id,
    name: raw.name,
    animated: raw.data.animated,
    flags: raw.data.flags,
  };
}

export async function fetchGlobalEmotes(): Promise<SevenTvEmote[]> {
  const res = await fetch("https://7tv.io/v3/emote-sets/global");
  if (!res.ok) throw new Error(`7TV API error: ${res.status}`);
  const json: SevenTvGlobalResponse = await res.json();
  return json.emotes.map(mapRawEmote);
}

export async function searchEmotes(
  query: string,
  page = 1,
  perPage = 20,
): Promise<SevenTvEmote[]> {
  const res = await fetch("https://api.7tv.app/v4/gql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query($q: String!, $page: Int, $perPage: Int) {
        emotes {
          search(query: $q, page: $page, per_page: $perPage) {
            items {
              id
              default_name
              animated
              images { url mime scale width height frame_count }
            }
          }
        }
      }`,
      variables: { q: query, page, perPage },
    }),
  });
  if (!res.ok) throw new Error(`7TV GQL error: ${res.status}`);
  const json: GqlSearchResponse = await res.json();
  return json.data.emotes.search.items.map((item) => ({
    id: item.id,
    name: item.default_name,
    animated: item.animated,
    flags: 0,
  }));
}

export function getEmoteUrl(
  id: string,
  size: "1x" | "2x" | "3x" | "4x" = "1x",
  animated = true,
): string {
  const file = animated ? `${size}.webp` : `${size}_static.webp`;
  return `https://cdn.7tv.app/emote/${id}/${file}`;
}
