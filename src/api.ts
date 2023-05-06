import {
  DECENTRALAND_API_URL,
  GOVERNANCE_API_URL,
  MIN_VALID_VP,
  SNAPSHOT_API_URL,
  SNAPSHOT_SPACE,
} from './config';

export interface Proposal {
  id: string;
  title: string;
}

export interface Vote {
  id: string;
  voter: string;
}

export interface UserProfile {
  avatars: {
    ethAddress: string;
    name: string;
  }[];
}

export const getProposals = async (
  limit: number,
  offset: number
): Promise<Proposal[] | undefined> => {
  try {
    const res = await fetch(
      `${GOVERNANCE_API_URL}/proposals?limit=${limit}&offset=${offset}`
    );
    const json = await res.json();
    return json.data;
  } catch {
    log('Failed to fetch proposals');
  }
};

export const getTodaysVotes = async (): Promise<Vote[] | undefined> => {
  try {
    const currentDate = new Date().toJSON().slice(0, 10);
    const dateGTE = Math.floor(
      new Date(`${currentDate}T00:00:00.000Z`).valueOf() / 1000
    );
    const dateLTE = Math.floor(
      new Date(`${currentDate}T23:59:59.999Z`).valueOf() / 1000
    );

    const query = `query Votes($space: String!, $start: Int!, $end: Int!, $first: Int!, $skip: Int!, $vp: Float!) {
          votes (
            skip: $skip
            first: $first
            where: {
              space: $space
              created_gte: $start
              created_lte: $end
              vp_gte: $vp
            }
            orderBy: "created",
            orderDirection: desc
          ) {
            id
            voter
            vp
          }
        }   
        `;

    const variables = {
      skip: 0,
      first: 1000,
      space: SNAPSHOT_SPACE,
      start: dateGTE,
      end: dateLTE,
      vp: MIN_VALID_VP,
    };

    const res = await fetch(SNAPSHOT_API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await res.json();
    return json?.data?.votes;
  } catch {
    log('Failed to fetch votes from Snapshot');
  }
};

export const getUserProfiles = async (
  addresses: string[]
): Promise<UserProfile[] | undefined> => {
  try {
    const res = await fetch(
      `${DECENTRALAND_API_URL}/profiles/?id=${addresses.join('&id=')}`
    );
    const json = await res.json();
    return json;
  } catch {
    log('Failed to fetch user profiles');
  }
};
