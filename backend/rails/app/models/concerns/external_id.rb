module ExternalId
  extend ActiveSupport::Concern

  included do
    validates :eid, presence: true, uniqueness: true
  end

  module ClassMethods
    def find_or_initialize_by_eid eid
      find_by(eid: eid) || initialize_by_eid(eid) || (raise ActiveRecord::RecordNotFound)
    end

    def initialize_by_eid eid
      new(eid: eid)
    end
  end

  def to_param
    eid
  end
end