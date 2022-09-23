import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";


import { getProfiler } from "../../lib/profilers";
import styles from "../../styles/Home.module.css";
import { APi } from "../api/profilers/types";

const StyleLI: React.CSSProperties= {
  display: "flex",
  gap: "10px",
  flexDirection: "column",
  borderBottom: "1px solid #ccc",
  paddingBottom: "5px",
}
const StyleUL = { listStyle: "none" }

const Home = ({ data }: APi) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>PROFILER</h1>

      {data.map((item) => (
        <ul key={item.id} style={StyleUL}>
          <li
            style={StyleLI}
          >
            <label>
              Nome: <strong>{item.name}</strong>{" "}
            </label>

            <label>
              Profiler: <strong>{item.profiler}</strong>{" "}
            </label>
          </li>
        </ul>
      ))}
      <a href="/api/pdf" download="generated_pdf.pdf" className={styles.button_print} >Download PDF</a>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await getProfiler();

  return {
    props: { data },
    revalidate: 5,
  };
};
