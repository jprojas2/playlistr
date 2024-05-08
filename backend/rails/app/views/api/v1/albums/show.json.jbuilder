json.(@album, :eid)
json.(@album, :name)
json.(@album, :image_url)
json.songs @album.songs do |song|
  json.extract! song, :eid, :thumbnail_url, :name
end