const { title } = require("process");
const model = require("../model/episode");
const revmodel = require("../model/episode_review");
const season_model = require("../model/season");
const { removeEmptyFields } = require("../utils/validate");
const findep = async (id, index) => {
  try {
    const episodes = [];
    const seasons = await season_model.getseason(id);
    const season = seasons[index - 1];
    if (!season) {
      return console.log("nothing");
    }
    const episodes_data = await model.findep(season.id);
    for (const episode_data of episodes_data) {
      const episode = {
        id: episode_data.id,
        number: episode_data.episode_number,
        title: episode_data.title,
        description: episode_data.description,
        duration_minutes: episode_data.duration_minutes,
        release_date: episode_data.release_date,
        vid: episode_data.videos_id,
        sid: episode_data.subs_id,
        videos: await model.videos(episode_data.videos_id),
        subs: await model.subs(episode_data.subs_id),
        review: await revmodel.getreview(episode_data.id),
      };
      episodes.push(episode);
    }
    episodes.sort((a, b) => Number(a.id) - Number(b.id));
    return episodes;
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const getep = async (req, res, next) => {
  const { id, index, jindex } = req.params;
  try {
    const episodes = await findep(id, index);
    const episode = episodes[jindex - 1];
    if (!episode) {
      return res.status(404).send("not found");
    }
    res.status(200).json(episode);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const getallep = async (req, res, next) => {
  const { id, index } = req.params;
  try {
    const episodes = await findep(id, index);
    if (!episodes) {
      return res.status(404).send("not found");
    }
    res.status(200).json(episodes);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const postep = async (req, res, next) => {
  const datas = req.body;
  const { id, index } = req.params;
  const seasons = await season_model.getseason(id);
  console.log(seasons);

  const season = seasons[index - 1];
  if (!season) {
    return res.status(404).send("not found!");
  }
  try {
    for (const data of datas) {
      const subs = data.subs;
      const videos = data.videos;
      const newsubs = await model.creatmsubs();
      const newvideos = await model.creatvideos();
      for (const sub of subs) {
        const subt = {
          language: sub.language,
          file_url: sub.file_url,
          subs_id: newsubs.id,
        };
        await model.creatsub(subt);
      }
      for (const video of videos) {
        const videot = {
          quality: video.quality,
          file_url: video.file_url,
          videos_id: newvideos.id,
        };
        await model.creatvideo(videot);
      }
      const episode = {
        season_id: season.id,
        title: data.title,
        episode_number: data.episode_number,
        description: data.description,
        duration_minutes: data.duration_minutes,
        release_date: data.release_date,
        videos_id: newvideos.id,
        subs_id: newsubs.id,
      };
      await model.createep(episode);
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const patchep = async (req, res, next) => {
  const { id, index, jindex } = req.params;
  const data = req.body;
  const episodes = await findep(id, index);
  const episode = episodes[jindex - 1];
  if (!episode) {
    res.status(404).send("not found");
  }
  try {
    const ep_data = removeEmptyFields({
      release_date: data.release_date,
      episode_number: data.episode_number,
      title: data.title,
      description: data.description,
      duration_minutes: data.duration_minutes,
    });
    await model.updateep(episode.id, ep_data);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const deleteep = async (req, res, next) => {
  try {
    const { id, index, jindex } = req.params;
    const episodes = await findep(id, index);
    const episode = episodes[jindex - 1];
    if (!episode) {
      res.status(404).send("Not found");
    }
    await model.removeep(episode.id);
    await model.removesubs(episode.sid);
    await model.removeep(episode.vid);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const postsub = async (req, res, next) => {
  try {
    const datas = req.body;
    const { id, index, jindex } = req.params;
    const episodes = await findep(id, index);
    const episode = episodes[jindex - 1];
    if (!episode) {
      return res.status(404), send("Not found");
    }
    for (const data of datas) {
      const subt = {
        language: data.language,
        file_url: data.file_url,
        subs_id: episode.sid,
      };
      await model.creatsub(subt);
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const postvideo = async (req, res, next) => {
  try {
    const datas = req.body;
    const { id, index, jindex } = req.params;
    const episodes = await findep(id, index);
    const episode = episodes[jindex - 1];
    if (!episode) {
      return res.status(404), send("Not found");
    }
    for (const data of datas) {
      const videot = {
        quality: data.quality,
        file_url: data.file_url,
        videos_id: episode.vid,
      };
      await model.creatvideo(videot);
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const findsub = async (id, index, jindex) => {
  try {
    const episodes = await findep(id, index);
    const episode = await episodes[jindex - 1];
    const subs = episode.subs;
    subs.sort((a, b) => Number(a.id) - Number(b.id));
    return subs;
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const getallsubs = async (req, res, next) => {
  try {
    const { id, index, jindex } = req.params;
    const result = await findsub(id, index, jindex);
    if (!result) {
      return res.status(404).send("Not found");
    }
    res.status(200).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const getsub = async (req, res, next) => {
  try {
     const { id, index, jindex,vindex } = req.params;
    const subs = await findsub(id, index, jindex);
    const result =  subs[vindex-1]
    if (!result) {
      return res.status(404).send("Not found");
    }
    res.status(200).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
const findvideo = async (id, index, jindex) => {
  try {
    const episodes = await findep(id, index);
    const episode = await episodes[jindex - 1];
    const videos = episode.videos;
    videos.sort((a, b) => Number(a.id) - Number(b.id));
    return videos;
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const getallvideos =  async (req, res, next) => {
  try {
    const { id, index, jindex } = req.params;
    const result = await findvideo(id, index, jindex);
    if (!result) {
      return res.status(404).send("Not found");
    }
    res.status(200).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const getvideos =  async (req, res, next) => {
  try {
    const { id, index, jindex ,vindex} = req.params;
    const videos = await findvideo(id, index, jindex);
   const  result = videos[vindex-1]
    if (!result) {
      return res.status(404).send("Not found");
    }
    res.status(200).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
const deletesub =  async (req, res, next) => {
  try {
    
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}
module.exports = {
  getep,
  getallep,
  postep,
  patchep,
  deleteep,
  postsub,
  postvideo,
  getallsubs,
  getsub,
  getallvideos,
  getvideos
};
