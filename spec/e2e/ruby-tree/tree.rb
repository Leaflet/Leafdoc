# Adapted from https://github.com/evolve75/RubyTree/


# tree.rb - This file is part of the RubyTree package.
#
# = tree.rb - Generic implementation of an N-ary tree data structure.
#
# Provides a generic tree data structure with ability to
# store keyed node elements in the tree.  This implementation
# mixes in the Enumerable module.
#
# Author:: Anupam Sengupta (anupamsg@gmail.com)
#

# Copyright (c) 2006-2015, 2017 Anupam Sengupta
#
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# - Redistributions of source code must retain the above copyright notice, this
#   list of conditions and the following disclaimer.
#
# - Redistributions in binary form must reproduce the above copyright notice,
#   this list of conditions and the following disclaimer in the documentation
#   and/or other materials provided with the distribution.
#
# - Neither the name of the organization nor the names of its contributors may
#   be used to endorse or promote products derived from this software without
#   specific prior written permission.
#
#   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#

require 'tree/tree_deps'

# This module provides a *TreeNode* class whose instances are the primary
# objects for representing nodes in the tree.
#
# This module also acts as the namespace for all classes in the *RubyTree*
# package.
module Tree

  # 🍂class TreeNode
  #
  # This class models the nodes for an *N-ary* tree data structure. The
  # nodes are *named*, and have a place-holder for the node data (i.e.,
  # _content_ of the node). The node names are required to be *unique*
  # amongst the sibling/peer nodes. Note that the name is implicitly
  # used as an _ID_ within the data structure).
  #
  # The node's _content_ is *not* required to be unique across
  # different nodes in the tree, and can be +nil+ as well.
  #
  # The class provides various methods to navigate the tree, traverse
  # the structure, modify contents of the node, change position of the
  # node in the tree, and to make structural changes to the tree.
  #
  # A node can have any number of *child* nodes attached to it and
  # hence can be used to create N-ary trees.  Access to the child
  # nodes can be made in order (with the conventional left to right
  # access), or randomly.
  #
  # The node also provides direct access to its *parent* node as well
  # as other superior parents in the path to root of the tree.  In
  # addition, a node can also access its *sibling* nodes, if present.
  #
  # Note that while this implementation does not _explicitly_ support
  # directed graphs, the class itself makes no restrictions on
  # associating a node's *content* with multiple nodes in the tree.
  # However, having duplicate nodes within the structure is likely to
  # cause unpredictable behavior.
  #
  # 🍂example
  #
  # {include:file:examples/example_basic.rb}
  class TreeNode
    include Enumerable
    include Comparable
    include Tree::Utils::TreeMetricsHandler
    include Tree::Utils::TreePathHandler
    include Tree::Utils::CamelCaseMethodHandler
    include Tree::Utils::JSONConverter
    include Tree::Utils::TreeMergeHandler
    include Tree::Utils::HashConverter

    # 🍂section Core Attributes

    # 🍂property name: String|Integer
    #
    # Name of this node.  Expected to be unique within the tree.
    #
    # Note that the name attribute really functions as an *ID* within
    # the tree structure, and hence the uniqueness constraint is
    # required.
    #
    # This may be changed in the future, but for now it is best to
    # retain unique names within the tree structure, and use the
    # `content` attribute for any non-unique node requirements.
    #
    # If you want to change the name, you probably want to call [`rename`](#treenode-rename)
    # instead.

    attr_reader   :name

    # 🍂property content
    # Content of this node.  Can be `nil`.  Note that there is no
    # uniqueness constraint related to this attribute.
    attr_accessor :content

    # 🍂property parent: TreeNode; Parent of this node.  Will be `nil` for a root node.
    attr_reader   :parent

    # 🍂method root(): TreeNode
    # Gets the root node for the (sub)tree to which this node belongs.
    # A root node's root is itself.
    def root
      root = self
      root = root.parent until root.is_root?
      root
    end

    # 🍂method is_root?():Boolean
    # Returns `true` if this is a root node.  Note that
    # orphaned children will also be reported as root nodes.
    def is_root?
      @parent.nil?
    end


    # 🍂section Node Creation

    # 🍂method initialize(name: String|Integer, content):nil
    # Creates a new node with a name and optional content.
    # The node name is expected to be unique within the tree.
    #
    # The content can be of any type, and defaults to `nil`.
    #
    # Note: If the name is an `Integer`, then the semantics of {#[]} access
    #   method can be surprising, as an `Integer` parameter to that method
    #   normally acts as an index to the children array, and follows the
    #   _zero-based_ indexing convention.
    #
    def initialize(name, content = nil)
      raise ArgumentError, 'Node name HAS to be provided!' if name == nil
      @name, @content = name, content

      if name.kind_of?(Integer)
        warn StructuredWarnings::StandardWarning,
             'Using integer as node name.'\
             ' Semantics of TreeNode[] may not be what you expect!'\
             " #{name} #{content}"
      end

      self.set_as_root!
      @children_hash = Hash.new
      @children = []
    end

    # 🍂method add(child: TreeNode, at_index: Integer=1):TreeNode
    #
    # Adds the specified child node to this node.
    #
    # This method can also be used for *grafting* a subtree into this
    # node's tree, if the specified child node is the root of a subtree (i.e.,
    # has child nodes under it).
    #
    # this node becomes parent of the node passed in as the argument, and
    # the child is added as the last child ("right most") in the current set of
    # children of this node.
    #
    # Additionally you can specify a insert position. The new node will be
    # inserted BEFORE that position. If you don't specify any position the node
    # will be just appended. This feature is provided to make implementation of
    # node movement within the tree very simple.
    #
    # If an insertion position is provided, it needs to be within the valid
    # range of:
    #
    #    -children.size..children.size
    #
    # This is to prevent `nil` nodes being created as children if a non-existent
    # position is used.
    #
    # If the new node being added has an existing parent node, then it will be
    # removed from this pre-existing parent prior to being added as a child to
    # this node. I.e., the child node will effectively be moved from its old
    # parent to this node. In this situation, after the operation is complete,
    # the node will no longer exist as a child for its old parent.
    #
    # Returns the added child node.
    #
    def add(child, at_index = -1)
      # Only handles the immediate child scenario
      raise ArgumentError,
            'Attempting to add a nil node' unless child
      raise ArgumentError,
            'Attempting add node to itself' if self.equal?(child)
      raise ArgumentError,
            'Attempting add root as a child' if child.equal?(root)

      # Lazy mans unique test, won't test if children of child are unique in
      # this tree too.
      raise "Child #{child.name} already added!"\
            if @children_hash.include?(child.name)

      child.parent.remove! child if child.parent # Detach from the old parent

      if insertion_range.include?(at_index)
        @children.insert(at_index, child)
      else
        raise 'Attempting to insert a child at a non-existent location'\
              " (#{at_index}) "\
              'when only positions from '\
              "#{insertion_range.min} to #{insertion_range.max} exist."
      end

      @children_hash[child.name]  = child
      child.parent = self
      child
    end

    # Return a range of valid insertion positions.  Used in the #add method.
    def insertion_range
      max = @children.size
      min = -(max+1)
      min..max
    end

    private :insertion_range

    # 🍂method rename(new_name: String|Integer): String|Integer
    # Renames the node and updates the parent's reference to it. Returns the old name.
    def rename(new_name)
      old_name = @name

      if is_root?
        self.name=(new_name)
      else
        @parent.rename_child old_name, new_name
      end

      old_name
    end


    # [Snip]

  end
end
