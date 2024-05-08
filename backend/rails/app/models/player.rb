class Player < ApplicationRecord
  belongs_to :user
  has_many :player_items, -> { order(:song_index) }, dependent: :destroy
  has_many :songs, through: :player_items

  validates :user_id, uniqueness: true

  def current_song
    @current_song ||= songs.where('player_items.song_index = ?', playing_index).first
  end

  def play
    update(playing: true, started_at: Time.now)
  end

  def next
    update(playing_index: playing_index + 1,
      started_at: Time.now, paused_at: 0) if playing_index < player_items.count
  end

  def previous
    update(playing_index: playing_index - 1,
      started_at: Time.now, paused_at: 0) if playing_index > 0
  end

  def pause
    update(playing: false, paused_at: Time.now - started_at) if playing
  end

  def add_song(song)
    player_items.create(song: song, song_index: player_items.count)
  end

  def add_song_at(song, song_index)
    with_keeping_current_song do
      player_items.where('song_index >= ?', song_index).update_all('song_index = song_index + 1')
      player_items.create!(song: song, song_index: song_index)
    end
  end

  def play_song(song)
    clear
    add_song(song)
    play
  end

  def play_song_next(song)
    add_song_at(song, playing_index + 1)
  end

  def play_playlist(playlist, song_index = 0)
    clear
    playlist.songs.each do |song|
      add_song(song)
    end
    update(playing_index: song_index)
    play
  end

  def remove_song_at(song_index)
    player_items.find_by(song_index: song_index).destroy
    refresh_indexes
  end

  def move_song(from_index, to_index)
    moved_song = player_items.find_by(song_index: from_index)
    return unless moved_song

    conflicting_song = player_items.find_by(song_index: to_index)
    with_keeping_current_song do
      conflicting_song.update!(song_index: player_items.size) if conflicting_song
      moved_song.update!(song_index: to_index) if moved_song
      conflicting_song.update!(song_index: from_index) if conflicting_song
    end
  end

  def clear
    player_items.destroy_all
    update(playing: false, playing_index: 0, started_at: nil, paused_at: nil)
  end

  private

  def with_keeping_current_song
    playing_song = player_items.find_by(song_index: playing_index)
    yield
    update(playing_index: playing_song ? playing_song.reload.song_index : playing_index)
  end
  
  def refresh_indexes
     with_keeping_current_song do
      player_items.each_with_index do |item, index|
        item.update(song_index: index)
      end
    end
  end
end
