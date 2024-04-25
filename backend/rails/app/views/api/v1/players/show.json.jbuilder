json.(@player, :user_id)
json.(@player, :playing)
json.(@player, :started_at)
json.(@player, :paused_at)
json.current_song do
  json.eid @player.current_song.eid
  json.name @player.current_song.name
  json.image_url @player.current_song.image_url
  json.artist do
    json.eid @player.current_song.artist.eid
    json.name @player.current_song.artist.name
  end if @player.current_song.artist
  json.album do
    json.eid @player.current_song.album.eid
    json.name @player.current_song.album.name
  end if @player.current_song.album
end if @player.current_song