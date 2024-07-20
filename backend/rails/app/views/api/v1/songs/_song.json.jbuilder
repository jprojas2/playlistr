json.extract! song, :id, :eid, :name, :duration, :image_url, :lyrics, :created_at, :updated_at
json.favorited song.favorited(@current_user)
json.artist do
  json.eid song.artist.eid
  json.name song.artist.name
  json.image_url song.artist.image_url
end if song.artist
json.album do
  json.eid song.album.eid
  json.name song.album.name
  json.image_url song.album.image_url
end if song.album
json.duration song.duration