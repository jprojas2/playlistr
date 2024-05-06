json.(@playlist, :id)
json.(@playlist, :user_id)
json.(@playlist, :name)
json.songs @playlist.playlist_songs do |ps|
  json.song_index ps.song_index
  json.eid ps.song.eid
  json.name ps.song.name
  json.image_url ps.song.image_url
  json.artist do
    json.eid ps.song.artist.eid
    json.name ps.song.artist.name
  end if ps.song.artist
  json.album do
    json.eid ps.song.album.eid
    json.name ps.song.album.name
  end if ps.song.album
end
