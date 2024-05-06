json.extract! song, :id, :eid, :name, :duration, :image_url, :lyrics, :created_at, :updated_at
json.favorited song.favorited(@current_user)
json.artist do
  json.eid song.artist.eid
  json.name song.artist.name
end
json.album do
  json.eid song.album.eid
  json.name song.album.name
end