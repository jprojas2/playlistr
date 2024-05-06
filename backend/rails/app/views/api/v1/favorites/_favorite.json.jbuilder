json.extract! favorite, :id, :user_id, :song_id, :favorite_index, :created_at, :updated_at
json.song do
  json.partial! 'api/v1/songs/song', song: favorite.song
end