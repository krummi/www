class Blog < ActiveRecord::Base

  has_many :taggings
  has_many :tags, through: :taggings

  # Slugs
  extend FriendlyId
  friendly_id :title, :use => :history

  # Events
  after_initialize :init

  # Initialization
  def init
    self.views ||= 0
    self.is_published ||= false
  end

  def should_generate_new_friendly_id?
    title_changed?
  end

  def self.tagged_with(name)
  	tag = Tag.where(name: name).first
    if tag != nil
      return tag.blogs
    end
    return []
  end

  def tag_list
  	tags.map(&:name).join(", ")
  end

  def tag_list=(names)
  	self.tags = names.split(",").map do |t|
  		Tag.where(name: t.strip).first_or_create!
  	end
  end

end
