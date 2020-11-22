import React from "react";
import Axios from "axios";
import { useState, useEffect } from "react";
import "./match.css";

const Match = ({
  _id,
  homeTeam,
  awayTeam,
  homeTeamScore,
  awayTeamScore,
  status,
  startTime,
}) => {
  const [stat, setStat] = useState(status);
  const [homeScore, setHomeScore] = useState(homeTeamScore);
  const [awayScore, setAwayScore] = useState(awayTeamScore);
  const [editMode, setEditMode] = useState(null);
  const [hTeam, sethTeam] = useState(homeTeam);
  const [aTeam, setaTeam] = useState(awayTeam);
  const [date, setDate] = useState(startTime.slice(0, 10));
  const [time, setTime] = useState(startTime.slice(11, 16));

  const toggle = () => {
    if (status === "soon") {
      status = "live";
      Axios.patch(`http://localhost:3006/matches/${_id}`, {
        isActive: true,
        startTime: new Date(),
      })
        .then(res => {
          console.log(res);
          setStat("live");
          setHomeScore("0");
          setAwayScore("0");
        })
        .catch(err => console.log(err));
    }
  };

  const handleDelete = () => {
    Axios.delete(`http://localhost:3006/matches/${_id}`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
    window.location.reload(false);
  };

  const hanldeEdit = () => {
    setEditMode(true);
  };

  const submitEdit = () => {
    const dateTime = date + "T" + time + ":00.000Z";
    console.log(dateTime);
    Axios.patch(`http://localhost:3006/matches/${_id}`, {
      homeTeam: hTeam,
      awayTeam: aTeam,
      startTime: dateTime,
    });
  };

  return (
    <div className="match">
      <div className="teams">
        <p className="homeTeam">{hTeam}</p>
        <p className="homeTeamScore">{stat === "soon" ? "-" : homeScore}</p>
        <span className="status">{stat}</span>
        <p className="awayTeamScore">{stat === "soon" ? "-" : awayScore}</p>
        <p className="awayTeam">{aTeam}</p>
      </div>
      <div className="timeInfo">
        <p className="date">{date}</p>
        <p className="startTime">{time}</p>
        <button className="btn" onClick={toggle}>
          {stat === "soon" ? "Start" : "Stop"}
        </button>
      </div>
      <button className="btn" onClick={handleDelete}>
        Delete
      </button>
      <button className="btn" onClick={hanldeEdit}>
        Edit
      </button>

      {editMode ? (
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

          <button className="btn" onClick={submitEdit}>
            OK
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Match;
