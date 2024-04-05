module ExternalId
  extend ActiveSupport::Concern

  included do
    validates :eid, presence: true, uniqueness: true
  end

  def to_param
    eid
  end
end