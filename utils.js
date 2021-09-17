exports.parseStrava = (data) => {
  return data.gpx.trk.trkseg.trkpt.map((pt) => {
    return { latitude: pt['-lat'], longitude: pt['-lon'], time: pt.time }
  })
}
