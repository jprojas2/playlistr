json.array! @playlists do |playlist|
  json.extract! playlist, :id, :name, :created_at, :updated_at
  json.image_urls playlist.songs[0..3].map(&:thumbnail_url)
end