/* global particlesJS, fetch */

import React, { Fragment, Component } from 'react'
import Script from 'react-load-script'
import Markdown from 'react-markdown'
import { Flex } from 'grid-styled'
import AnchorJS from 'anchor-js'
import Head from 'next/head'
import 'isomorphic-unfetch'

import { buildMeta, getPackageInfo } from 'helpers'

import { Home, GitHub } from 'react-feather'
import styled from 'styled-components'

const Warning = styled.div`
  position: relative;
  padding: 16px;
  background-color: #dbedff;
  border: 1px solid #ff2e88;
  border-radius: 2px;
  color: #ff2e88;
  background-color: #000;
`

const IconLink = styled.a`
  position: relative;
  top: 1px;
  color: inherit;
  border: 0;

  &:hover,
  &:active,
  &:focus {
    background-color: inherit;
    color: #ff2e88;
  }
`

export default class Changelog extends Component {
  static async getInitialProps ({ query }) {
    console.log('changelog!')
    const pkgInfo = await getPackageInfo(query.package)

    const {
      changelogFilename,
      description,
      homepage,
      license,
      readme,
      repository,
      version
    } = pkgInfo

    const hasChangelog = changelogFilename != null
    let html

    if (hasChangelog) {
      const res = await fetch(changelogFilename)
      html = await res.text()
    } else {
      html = readme
    }

    return {
      version,
      hasChangelog,
      description,
      repository,
      homepage,
      license,
      html
    }
  }

  componentDidMount () {
    new AnchorJS().add('.changelog h1, .changelog h2, .changelog h3')
  }
  render () {
    const {
      hasChangelog,
      html,
      license,
      description,
      homepage,
      repository
    } = this.props
    const { package: pkgName } = this.props.url.query

    return (
      <Fragment>
        <Head>
          {buildMeta({
            title: `${pkgName} | changes.now.sh`,
            name: pkgName,
            description
          })}
        </Head>
        {!hasChangelog && (
          <div style={{ marginTop: '2rem' }}>
            <Warning>Not changelog found :(</Warning>
          </div>
        )}
        <header>
          <h1>{pkgName}</h1>
          <h3
            style={{
              marginTop: '2rem',
              marginBottom: '1rem',
              lineHeight: '1.65'
            }}
          >
            {description}
          </h3>
          <Flex alignItems='baseline' style={{ color: '#757575' }}>
            {license && (
              <span style={{ marginRight: '8px', fontSize: '14px' }}>
                {license}
              </span>
            )}

            {homepage && (
              <IconLink target='_blank' href={homepage}>
                <Home size={14} style={{ marginRight: '8px' }} />
              </IconLink>
            )}

            {repository && repository.url && (
              <IconLink target='_blank' href={repository.url}>
                <GitHub size={14} />
              </IconLink>
            )}
          </Flex>
        </header>
        <Markdown className='changelog' escapeHtml={false} source={html} />
        <Script
          url='https://cdn.jsdelivr.net/npm/particles.js@2/particles.min.js'
          onLoad={() => {
            window.particlesJS &&
              particlesJS.load('particles-js', '/static/particles.json')
          }}
        />
      </Fragment>
    )
  }
}
