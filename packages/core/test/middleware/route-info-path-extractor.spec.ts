import { RequestMethod, VersioningType } from '@nestjs/common';
import { ApplicationConfig } from '@nestjs/core';
import { mapToExcludeRoute } from '@nestjs/core/middleware/utils';
import { expect } from 'chai';
import { RouteInfoPathExtractor } from './../../middleware/route-info-path-extractor';

describe('RouteInfoPathExtractor', () => {
  describe('getPaths', () => {
    let appConfig: ApplicationConfig;
    let routeInfoPathExtractor: RouteInfoPathExtractor;
    beforeEach(() => {
      appConfig = new ApplicationConfig();
      appConfig.enableVersioning({
        type: VersioningType.URI,
      });
      routeInfoPathExtractor = new RouteInfoPathExtractor(appConfig);
    });

    it(`should return correct paths`, () => {
      expect(
        routeInfoPathExtractor.extractPathsFrom({
          path: '*',
          method: RequestMethod.ALL,
        }),
      ).to.eql(['/*']);

      expect(
        routeInfoPathExtractor.extractPathsFrom({
          path: '*',
          method: RequestMethod.ALL,
          version: '1',
        }),
      ).to.eql(['/v1/*']);
    });

    it(`should return correct paths when set global prefix`, () => {
      appConfig.setGlobalPrefix('api');

      expect(
        routeInfoPathExtractor.extractPathsFrom({
          path: '*',
          method: RequestMethod.ALL,
        }),
      ).to.eql(['/api/*']);

      expect(
        routeInfoPathExtractor.extractPathsFrom({
          path: '*',
          method: RequestMethod.ALL,
          version: '1',
        }),
      ).to.eql(['/api/v1/*']);
    });

    it(`should return correct paths when set global prefix and global prefix options`, () => {
      appConfig.setGlobalPrefix('api');
      appConfig.setGlobalPrefixOptions({
        exclude: mapToExcludeRoute(['foo']),
      });

      expect(
        routeInfoPathExtractor.extractPathsFrom({
          path: '*',
          method: RequestMethod.ALL,
        }),
      ).to.eql(['/api/*', '/foo']);

      expect(
        routeInfoPathExtractor.extractPathsFrom({
          path: '*',
          method: RequestMethod.ALL,
          version: '1',
        }),
      ).to.eql(['/api/v1/*', '/v1/foo']);

      expect(
        routeInfoPathExtractor.extractPathsFrom({
          path: 'foo',
          method: RequestMethod.ALL,
          version: '1',
        }),
      ).to.eql(['/v1/foo']);

      expect(
        routeInfoPathExtractor.extractPathsFrom({
          path: 'bar',
          method: RequestMethod.ALL,
          version: '1',
        }),
      ).to.eql(['/api/v1/bar']);
    });
  });
});