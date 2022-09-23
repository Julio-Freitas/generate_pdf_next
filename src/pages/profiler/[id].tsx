import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";

import { getProfiler } from "../../lib/profilers";
import styles from "../../styles/Home.module.css";
import { Profiler } from "../api/profilers/types";

type ProfileProps = {
  profiler: Profiler
}
const Home = ({ profiler}:ProfileProps) => {

  return (
    <div className={styles.container}>
      <h1>Ola eu sou o {profiler.name}</h1>
      <p>Meu profiler é {profiler.profiler}</p>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<{ profiler: Profiler }> = async (
  context
) => {
  const { params } = context;
  const { id } = params as { id: string };
  const { data } = await getProfiler();
  const profiler = data.find((item) => item.id === Number(id)) as Profiler;
  return {
    props:  {profiler},
    revalidate: 5,
  };
};

export const getStaticPaths: GetStaticPaths<{ id: string }> = async () => {
  const { data } = await getProfiler();
  const arr: string[] = data.map((item) => item.id.toString());
  const paths = arr.map((id) => {
    return {
      params: { id },
    };
  });
  return { paths, fallback: false };
};
