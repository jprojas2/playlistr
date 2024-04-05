require "test_helper"

class SongTest < ActiveSupport::TestCase

  test "initialize by eid" do
    genius_client = Genius.new
    genius_client.stub :song, JSON.parse(File.read("test/fixtures/genius/song_response.json")) do
      Artist.stub :find_or_initialize_by_eid, artists(:one) do
        Album.stub :find_or_initialize_by_eid, albums(:one) do
          song = Song.initialize_by_eid("123")
          assert_instance_of Song, song
          assert_equal song.eid, "123"
          assert song.new_record?
          assert_instance_of Artist, song.artist
          assert_instance_of Album, song.album
        end
      end
    end
  end
end
