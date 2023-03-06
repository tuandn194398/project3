import { useEffect, useState } from "react";
import "./Blog.css";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getContract } from "../ultils/Contract";
import { getMetadata } from "../ultils/IPFS";
import LoadingCard from "../components/LoadingCard";
import { Divider , Switch } from "antd";
const config = require('../config.json');
const moment = require('moment-timezone');
// import { Url } from "../config/constants";

function Blog() {
  
  const location = useLocation();
  let { path, mode, id } = useParams();
  const [mode_, setMode_] = useState(mode == "true" ? true : false);
  const [metadata, setMetadata] = useState({});
  const [step, setStep] = useState(-1);
  const navigate = useNavigate();

  async function getBlog() {
      const md = await getMetadata(path);
      md.date = moment(md.date).tz(config.TIMEZONE).format('YYYY-MM-DD HH:mm')
      setMetadata(md);
  }

  useEffect(() => { 
    getBlog();
  }, []);

  async function onChange(checked) {
    window.sessionStorage.clear();
    setMode_(checked);
    await getContract().ownedChangeMode(id, checked);
    setStep(step - 1);
    navigate(`/blog/${path}/${checked}/${id}`);
  }
  
  return (
    <div className='blogDetail wrapper'>
      <h3>{metadata.date}</h3>

      <form action={location.pathname}>
        <h4>Mode:</h4>
        <div className="sw">
          <Switch checkedChildren="Public" unCheckedChildren="Private" disabled={id == undefined || id == null} checked={mode_} onChange={onChange}></Switch>
        </div>
      </form>

      <div className='blogDetail__top'>
        <div className='blogDetail__topDec'>
          <h2>{metadata.title}</h2>
          <span>By: {metadata.author}</span>
        </div>
      </div>

      <div className='blogDetail__bottomDec'>
        <h4>Content</h4>
        <p>{metadata.content}</p>
      </div>

      <a href={`javascript:javascript:history.go(${step})`} className='sourceLink'>Back</a>
    </div>
  );
}

export default Blog;