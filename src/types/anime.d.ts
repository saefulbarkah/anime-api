export type episodeListType = {
  title?: string;
  date?: string;
};

export type animeProps = {
  title: string;
  japanese: string;
  thumbnail: string;
  type: string;
  status: string;
  episodes: number;
  duration: string;
  releaseDate: Date;
  studio: string;
  genres: string[];
  episodeLists: episodeListType[];
};