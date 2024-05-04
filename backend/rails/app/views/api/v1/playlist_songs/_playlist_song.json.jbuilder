json.extract! playlist_song, :id, :song_id, :playlist_id, :song_index, :created_at, :updated_at
json.url playlist_song_url(playlist_song, format: :json)
