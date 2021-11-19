--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2021-11-19 21:40:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16396)
-- Name: Cars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cars" (
    id integer NOT NULL,
    platenum character varying(20)
);


ALTER TABLE public."Cars" OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16395)
-- Name: Cars_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Cars" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."Cars_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 16409)
-- Name: UsersRent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UsersRent" (
    car_id_fk integer NOT NULL,
    startdate date NOT NULL,
    enddate date NOT NULL,
    duration smallint,
    cost integer,
    rent_id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public."UsersRent" OWNER TO postgres;

--
-- TOC entry 3316 (class 0 OID 16396)
-- Dependencies: 214
-- Data for Name: Cars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cars" (id, platenum) FROM stdin;
1	F025WFA
2	X249DDB
3	F111ABC
4	F007AGT
5	X909DBA
\.


--
-- TOC entry 3317 (class 0 OID 16409)
-- Dependencies: 215
-- Data for Name: UsersRent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UsersRent" (car_id_fk, startdate, enddate, duration, cost, rent_id) FROM stdin;
\.


--
-- TOC entry 3323 (class 0 OID 0)
-- Dependencies: 213
-- Name: Cars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cars_id_seq"', 5, true);


--
-- TOC entry 3174 (class 2606 OID 16400)
-- Name: Cars Cars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cars"
    ADD CONSTRAINT "Cars_pkey" PRIMARY KEY (id);


--
-- TOC entry 3175 (class 2606 OID 16412)
-- Name: UsersRent car_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UsersRent"
    ADD CONSTRAINT car_id FOREIGN KEY (car_id_fk) REFERENCES public."Cars"(id);


-- Completed on 2021-11-19 21:40:36

--
-- PostgreSQL database dump complete
--

