require "test_helper"

class ArtistTest < ActiveSupport::TestCase
  
  test "initialize by eid" do
    genius_client = Genius.new
    genius_client.stub :artist, JSON.parse(File.read("test/fixtures/genius/artist_response.json")) do
      artist = Artist.initialize_by_eid("123")
      assert_instance_of Artist, artist
      assert_equal artist.eid, "123"
      assert artist.new_record?
    end
  end
end
