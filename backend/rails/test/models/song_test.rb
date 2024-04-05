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

  test "when lyrics are present get_lyrics should return lyrics and not get them from genius" do
    Genius.any_instance.expects(:lyrics).never
    song = songs(:one)
    song_lyrics = song.lyrics
    assert song_lyrics.present?

    song.get_lyrics
    assert_equal song.lyrics, song_lyrics
  end

  test "when lyrics are not present get_lyrics should get lyrics from genius" do
    song = songs(:one)
    mock = Minitest::Mock.new
    mock.expect :lyrics, "lyrics", [song.eid]
    genius_client = Genius.stub :new, mock do
      song.lyrics = nil
      song.get_lyrics
      assert_equal song.lyrics, "lyrics"
    end
  end

  test "when lyrics are not present get_lyrics get_lyrics should save the song if it is not a new record" do
    song = songs(:one)
    mock = Minitest::Mock.new
    mock.expect :lyrics, "lyrics", [song.eid]
    genius_client = Genius.stub :new, mock do
      song.lyrics = nil
      song.expects(:save)
      song.get_lyrics
    end
  end
end
