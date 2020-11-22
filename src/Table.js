import React from "react";
import Match from "./Match";
import { useState, useEffect } from "react";
import Axios from "axios";
import "./match.css";

const Table = () => {
  const [data, setData] = useState();
  const [newMode, setNewMode] = useState();
  const [filterMode, setFilterMode] = useState();
  const [hTeam, sethTeam] = useState();
  const [aTeam, setaTeam] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [endTime, setEndTime] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [teamStatus, setTeamStatus] = useState();
  const [team, setTeam] = useState();
  useEffect(() => {
    Axios.get("http://localhost:3006/matches")
      .then(res => {
        setData(res.data.data);
      })
      .catch(err => console.log(err));
  }, []);
  console.log(data);

  if (data) {
    const dates = new Set();

    data.map(
      ({
        _id,
        homeTeam,
        awayTeam,
        homeTeamScore,
        awayTeamScore,
        status,
        startTime,
      }) => {
        let date = startTime.slice(0, 10);
        dates.add(date);
      }
    );

    const matches = data.map(
      ({
        _id,
        homeTeam,
        awayTeam,
        homeTeamScore,
        awayTeamScore,
        status,
        startTime,
      }) => {
        return (
          <Match
            key={_id}
            _id={_id}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homeTeamScore={homeTeamScore}
            awayTeamScore={awayTeamScore}
            startTime={startTime}
            status={status}
          />
        );
      }
    );

    const datesArray = [];
    for (let value of dates) datesArray.push(value);
    console.log(datesArray);
    // const groups = [];

    const submitNew = () => {
      const dateTime = date + "T" + time + ":00.000Z";
      const endtime = date + "T" + endTime + ":00.000Z";
      console.log(dateTime);
      Axios.post(`http://localhost:3006/matches/`, {
        homeTeam: hTeam,
        awayTeam: aTeam,
        startTime: dateTime,
        endTime: endtime,
        homeTeamScore: 0,
        awayTeamScore: 0,
        duration: 90,
        isActive: false,
        league: "Egyptian league",
      });
      setNewMode(false);
      getAllMatches();
    };

    const filterHandle = () => {
      const fromDate = from + "T00:00:00.000Z";
      const toDate = to + "T00:00:00.000Z";
      const teamstat = teamStatus + "Team";
      Axios.get(`http://localhost:3006/matches?${teamstat}=${team}`, {
        params: {
          "startTime[gte]": fromDate,
          "endTime[lte]": toDate,
        },
      })
        .then(res => {
          setData(res.data.data);
        })
        .catch(err => console.log(err));
    };

    const getAllMatches = () => {
      Axios.get("http://localhost:3006/matches")
        .then(res => {
          setData(res.data.data);
        })
        .catch(err => console.log(err));
    };

    return (
      <div>
        <button className="btn" onClick={getAllMatches}>
          All Matches
        </button>
        <button
          className="btn"
          onClick={e => {
            setNewMode(true);
          }}
        >
          New Match
        </button>

        <button
          className="btn"
          onClick={e => {
            setFilterMode(true);
          }}
        >
          Filter Matchs
        </button>

        {newMode ? (
          <div>
            <label>Home Team</label>
            <input
              type="text"
              name="homeTeam"
              onChange={e => {
                sethTeam(e.target.value);
              }}
              id=""
            />

            <label>Away Team</label>
            <input
              type="text"
              name="awayTeam"
              onChange={e => {
                setaTeam(e.target.value);
              }}
              id=""
            />

            <label>Date</label>
            <input
              type="text"
              name="date"
              placeholder="2020-01-01"
              onChange={e => {
                setDate(e.target.value);
              }}
              id=""
            />

            <label>Time</label>
            <input
              type="text"
              name="time"
              placeholder="00:00"
              onChange={e => {
                setTime(e.target.value);
              }}
              id=""
            />

            <label>Finish Time</label>
            <input
              type="text"
              name="time"
              placeholder="00:00"
              onChange={e => {
                setEndTime(e.target.value);
              }}
              id=""
            />

            <button className="btn" onClick={submitNew}>
              OK
            </button>
          </div>
        ) : (
          <div></div>
        )}
        {filterMode ? (
          <div>
            <label>From Date</label>
            <input
              type="text"
              name="date"
              placeholder="2020-01-01"
              onChange={e => {
                setFrom(e.target.value);
              }}
              id=""
            />

            <label>To Date</label>
            <input
              type="text"
              name="date"
              placeholder="2020-01-01"
              onChange={e => {
                setTo(e.target.value);
              }}
              id=""
            />

            <label>Team status</label>
            <input
              type="text"
              name="Team status"
              placeholder="Home/Away"
              onChange={e => {
                setTeamStatus(e.target.value);
              }}
              id=""
            />

            <label>Team</label>
            <input
              type="text"
              name="Team status"
              onChange={e => {
                setTeam(e.target.value);
              }}
              id=""
            />

            <button className="btn" onClick={filterHandle}>
              OK
            </button>
          </div>
        ) : (
          <div></div>
        )}
        {matches}
      </div>
    );
  } else {
    return <div>error to get data</div>;
  }
};

export default Table;
