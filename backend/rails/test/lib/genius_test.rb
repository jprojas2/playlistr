require "test_helper"

class GeniusTest < ActiveSupport::TestCase

  test "search should return an array of items" do
    genius_client = Genius.new
    genius_client.stub :request, JSON.parse(File.read("test/fixtures/genius/search_response.json")) do
      assert_instance_of Array, genius_client.search("123")
    end
  end

  test "song should return a song item" do
    genius_client = Genius.new
    genius_client.stub :request, JSON.parse(File.read("test/fixtures/genius/song_response.json")) do
      assert_includes genius_client.song("123").keys, "_type"
      assert_equal genius_client.song("123")["_type"], "song"
    end
  end

  test "artist should return a artist item" do
    genius_client = Genius.new
    genius_client.stub :request, JSON.parse(File.read("test/fixtures/genius/artist_response.json")) do
      assert_includes genius_client.artist("123").keys, "_type"
      assert_equal genius_client.artist("123")["_type"], "artist"
    end
  end
end