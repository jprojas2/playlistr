json.array! @results do |result|
  case result
  when Song
    json.extract! result, :id, :eid, :name, :image_url, :thumbnail_url
    json.artist do
      json.extract! result.artist, :id, :eid, :name, :image_url
    end if result.artist
    json._type "song"
  when Artist
    json.extract! result, :id, :eid, :name, :image_url
    json._type "artist"
  end
end